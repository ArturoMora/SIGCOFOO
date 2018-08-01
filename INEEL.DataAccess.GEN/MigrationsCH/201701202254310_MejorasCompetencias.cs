namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MejorasCompetencias : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_RelacionCategoriasTecnicas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaveCategoria = c.String(maxLength: 10),
                        categoriaEmpleado = c.String(maxLength: 180),
                        periodoId = c.Int(),
                        nivelIdServicio = c.Int(),
                        nivelIdTecnica = c.Int(),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId)
                .Index(t => t.periodoId);
            
            CreateTable(
                "CH.cat_ClasificacionAreas",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        area = c.Int(nullable: false),
                        nombreArea = c.String(maxLength: 250),
                        periodoId = c.Int(),
                        nivelId = c.Int(nullable: false),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id)
                .ForeignKey("CH.cat_NivelCompetenciaTecnica", t => t.nivelId, cascadeDelete: true)
                .ForeignKey("CH.cat_PeriodoEvaluacion", t => t.periodoId)
                .Index(t => t.periodoId)
                .Index(t => t.nivelId);
            
            AddColumn("CH.cat_NominaCompetencias", "categoriaServicio", c => c.Int());
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_ClasificacionAreas", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropForeignKey("CH.cat_ClasificacionAreas", "nivelId", "CH.cat_NivelCompetenciaTecnica");
            DropForeignKey("CH.cat_RelacionCategoriasTecnicas", "periodoId", "CH.cat_PeriodoEvaluacion");
            DropIndex("CH.cat_ClasificacionAreas", new[] { "nivelId" });
            DropIndex("CH.cat_ClasificacionAreas", new[] { "periodoId" });
            DropIndex("CH.cat_RelacionCategoriasTecnicas", new[] { "periodoId" });
            DropColumn("CH.cat_NominaCompetencias", "categoriaServicio");
            DropTable("CH.cat_ClasificacionAreas");
            DropTable("CH.cat_RelacionCategoriasTecnicas");
        }
    }
}
