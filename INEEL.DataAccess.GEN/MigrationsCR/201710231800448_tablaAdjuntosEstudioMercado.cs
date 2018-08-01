namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tablaAdjuntosEstudioMercado : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_AdjuntosEstudiosMercado",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        AdjuntoId = c.Long(),
                        EstudiosMercadoId = c.Int(nullable: false),
                        campoAdicional = c.String(),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_AdjuntosEstudiosMercado", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_AdjuntosEstudiosMercado", new[] { "AdjuntoId" });
            DropTable("CR.tab_AdjuntosEstudiosMercado");
        }
    }
}
