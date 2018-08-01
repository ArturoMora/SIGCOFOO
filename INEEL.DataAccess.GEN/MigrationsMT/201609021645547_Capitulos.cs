namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Capitulos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.EditorialCapitulo", "CursosPersonalId", "MT.CursosPersonal");
            DropForeignKey("MT.EditorialCapitulo", "Capitulos_CapitulosId", "MT.Capitulos");
            DropIndex("MT.EditorialCapitulo", new[] { "CursosPersonalId" });
            DropIndex("MT.EditorialCapitulo", new[] { "Capitulos_CapitulosId" });
            CreateTable(
                "MT.EditoresCapitulo",
                c => new
                    {
                        EditoresCapituloId = c.Int(nullable: false, identity: true),
                        Editor_Nombre = c.String(),
                        CapitulosId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EditoresCapituloId)
                .ForeignKey("MT.Capitulos", t => t.CapitulosId, cascadeDelete: true)
                .Index(t => t.CapitulosId);
            
            DropTable("MT.EditorialCapitulo");
        }
        
        public override void Down()
        {
            CreateTable(
                "MT.EditorialCapitulo",
                c => new
                    {
                        EditorialCapituloId = c.Int(nullable: false, identity: true),
                        Autor_ClavePersona = c.String(),
                        Autor_Nombre = c.String(),
                        CursosPersonalId = c.Int(nullable: false),
                        Capitulos_CapitulosId = c.Int(),
                    })
                .PrimaryKey(t => t.EditorialCapituloId);
            
            DropForeignKey("MT.EditoresCapitulo", "CapitulosId", "MT.Capitulos");
            DropIndex("MT.EditoresCapitulo", new[] { "CapitulosId" });
            DropTable("MT.EditoresCapitulo");
            CreateIndex("MT.EditorialCapitulo", "Capitulos_CapitulosId");
            CreateIndex("MT.EditorialCapitulo", "CursosPersonalId");
            AddForeignKey("MT.EditorialCapitulo", "Capitulos_CapitulosId", "MT.Capitulos", "CapitulosId");
            AddForeignKey("MT.EditorialCapitulo", "CursosPersonalId", "MT.CursosPersonal", "CursosPersonalId", cascadeDelete: true);
        }
    }
}
