namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdjuntosOn : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "AdjuntoId" });
            CreateTable(
                "CR.tab_AdjuntoPorOportunidad",
                c => new
                    {
                        AdjuntoPorOportunidadId = c.Int(nullable: false, identity: true),
                        AdjuntoId = c.Long(nullable: false),
                        OportunidadNegocioId = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AdjuntoPorOportunidadId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("CR.tab_OportunidadNegocios", t => t.OportunidadNegocioId, cascadeDelete: true)
                .Index(t => t.AdjuntoId)
                .Index(t => t.OportunidadNegocioId);
            
            DropColumn("CR.tab_OportunidadNegocios", "AdjuntoId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_OportunidadNegocios", "AdjuntoId", c => c.Long());
            DropForeignKey("CR.tab_AdjuntoPorOportunidad", "OportunidadNegocioId", "CR.tab_OportunidadNegocios");
            DropForeignKey("CR.tab_AdjuntoPorOportunidad", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_AdjuntoPorOportunidad", new[] { "OportunidadNegocioId" });
            DropIndex("CR.tab_AdjuntoPorOportunidad", new[] { "AdjuntoId" });
            DropTable("CR.tab_AdjuntoPorOportunidad");
            CreateIndex("CR.tab_OportunidadNegocios", "AdjuntoId");
            AddForeignKey("CR.tab_OportunidadNegocios", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
