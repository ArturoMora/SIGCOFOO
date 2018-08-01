namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mercado : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_EstudiosMercado",
                c => new
                    {
                        EstudiosMercadoId = c.Int(nullable: false, identity: true),
                        Tema = c.String(),
                        Fecha = c.DateTime(nullable: false),
                        ProyectoId = c.String(),
                        ClaveUnidad = c.String(maxLength: 10),
                        Acceso = c.String(),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.EstudiosMercadoId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .Index(t => t.AdjuntoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_EstudiosMercado", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_EstudiosMercado", new[] { "AdjuntoId" });
            DropTable("CR.tab_EstudiosMercado");
        }
    }
}
