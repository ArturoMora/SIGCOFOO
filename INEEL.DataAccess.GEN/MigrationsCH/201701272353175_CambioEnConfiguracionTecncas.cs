namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioEnConfiguracionTecncas : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaServicio", c => c.String(maxLength: 100));
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaTecnica", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaTecnica");
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaServicio");
        }
    }
}
