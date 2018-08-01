namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevosCatAliados2 : DbMigration
    {
        public override void Up()
        {
            DropIndex("CR.cat_Ambito", new[] { "Nombre" });
            CreateTable(
                "CR.cat_AmbitoConv",
                c => new
                    {
                        AmbitoConvId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 50),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AmbitoConvId)
                .Index(t => t.Nombre, unique: true);
            
            DropTable("CR.cat_Ambito");
        }
        
        public override void Down()
        {
            CreateTable(
                "CR.cat_Ambito",
                c => new
                    {
                        AmbitoId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 50),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AmbitoId);
            
            DropIndex("CR.cat_AmbitoConv", new[] { "Nombre" });
            DropTable("CR.cat_AmbitoConv");
            CreateIndex("CR.cat_Ambito", "Nombre", unique: true);
        }
    }
}
