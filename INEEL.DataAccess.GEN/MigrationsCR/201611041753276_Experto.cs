namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Experto : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.cat_Expertos",
                c => new
                    {
                        ExpertoId = c.Int(nullable: false, identity: true),
                        ContactoId = c.Int(nullable: false),
                        TipoExperto = c.Int(nullable: false),
                        ComunidadId = c.Int(),
                        Especialidad = c.String(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        LineaDesarrolloTecnologicoId = c.Int(nullable: false),
                        ClavePersona = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ExpertoId)
                .ForeignKey("CR.cat_LineaDesarrolloTecnologico", t => t.LineaDesarrolloTecnologicoId, cascadeDelete: true)
                .Index(t => t.LineaDesarrolloTecnologicoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.cat_Expertos", "LineaDesarrolloTecnologicoId", "CR.cat_LineaDesarrolloTecnologico");
            DropIndex("CR.cat_Expertos", new[] { "LineaDesarrolloTecnologicoId" });
            DropTable("CR.cat_Expertos");
        }
    }
}
