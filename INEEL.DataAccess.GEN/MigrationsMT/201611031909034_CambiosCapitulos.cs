namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosCapitulos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo");
            DropIndex("MT.Capitulos", new[] { "EstadoCapituloId" });
            AlterColumn("MT.Capitulos", "Year", c => c.DateTime());
            DropColumn("MT.Capitulos", "EstadoCapituloId");
        }
        
        public override void Down()
        {
            AddColumn("MT.Capitulos", "EstadoCapituloId", c => c.Int(nullable: false));
            AlterColumn("MT.Capitulos", "Year", c => c.String(maxLength: 30));
            CreateIndex("MT.Capitulos", "EstadoCapituloId");
            AddForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo", "EstadoCapituloId", cascadeDelete: true);
        }
    }
}
